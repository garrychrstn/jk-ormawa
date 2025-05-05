<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Events;
use App\Models\Registration;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class EventController extends Controller
{
    public function join(Request $request)
    {
        $data = $request->validate([
            "eventId" => "required",
            "name" => "required|string",
            "email" => "required|string|max:3000",
            "phoneNumber" => "required|string",
            "payment" => "required|image",
        ]);
        $currentTime = now()->timestamp;
        $imageName =
            "event" .
            $data["eventId"] .
            "_" .
            $currentTime .
            "." .
            $request->file("payment")->getClientOriginalExtension();
        $imagePath = $request
            ->file("payment")
            ->storeAs("registrations", $imageName, "public");
        $data["payment"] = $imagePath;

        Registration::create($data);
        return redirect()->back()->with("success", "Registered successfully");
    }
    public function register($id)
    {
        $event = Events::where("id", $id)->with("ormawa")->first();
        if ($event->registrationEnd < now()) {
            abort(404);
        }
        return Inertia::render("Events/Register", ["event" => $event]);
    }
    public function index()
    {
        $events = [];
        if (Auth::user()->role === "admin") {
            $events = Events::all();
        } else {
            $events = Events::where("ormawaId", Auth::user()->ormawaId)->get();
        }
        return Inertia::render("Events/Index", [
            "events" => $events,
        ]);
    }
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validate([
                "title" => "required|string",
                "description" => "required|string|max:3000",
                "location" => "required|string",
                "poster" => "required|image",
                "registrationStart" => "required|date",
                "registrationEnd" =>
                    "required|date|after_or_equal:registrationStart",
                "eventStart" => "required|date|after_or_equal:registrationEnd",
                "eventEnd" => "required|date|after_or_equal:eventStart",
            ]);

            $titleWords = explode(" ", trim($data["title"]));
            $nameFirstWord = $titleWords[0];
            $nameSecondWord = isset($titleWords[1]) ? $titleWords[1] : "";
            $imageNamePrefix =
                $nameFirstWord . ($nameSecondWord ? "_" . $nameSecondWord : "");
            $currentTime = now()->timestamp;
            $imageNamePrefix = preg_replace(
                "/[^A-Za-z0-9_\-]/",
                "",
                $imageNamePrefix
            );
            $imageName =
                $imageNamePrefix .
                "_" .
                $currentTime .
                "." .
                $request->file("poster")->getClientOriginalExtension();
            $imagePath = $request
                ->file("poster")
                ->storeAs("events", $imageName, "public");
            $data["poster"] = $imagePath;
            $data["ormawaId"] = Auth::user()->ormawaId;
            $data["createdBy"] = Auth::user()->id;
            $newEvent = Events::create($data);
            DB::commit();
            return redirect()->back();
        } catch (\Exception $e) {
            dd($e->getMessage());
            DB::rollback();
            return redirect()
                ->back()
                ->withErrors([
                    "error" => "Creation failed: " . $e->getMessage(),
                ])
                ->withInput();
        }
    }
}
