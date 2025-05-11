<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Events;
use App\Models\Feedback;
use Illuminate\Support\Str;
use App\Models\Registration;
use App\Models\Documentation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    public function documentation(Request $request)
    {
        DB::beginTransaction();
        try {
            $request->validate([
                "documentation" => "required|array",
                "documentation.*" => "file|max:10240",
                "eventId" => "required|integer",
            ]);

            $uploadedFiles = [];
            foreach ($request->file("documentation") as $file) {
                $currentTime = now()->timestamp;
                $eventId = $request->input("eventId");
                $i = 1;
                do {
                    $fileName =
                        "event_{$eventId}_{$currentTime}_{$i}." .
                        $file->getClientOriginalExtension();
                    $i++;
                } while (
                    file_exists(
                        storage_path(
                            "app/public/event_documentation/{$fileName}"
                        )
                    )
                );
                $filePath = $file->storeAs(
                    "event_documentation",
                    $fileName,
                    "public"
                );
                Documentation::create([
                    "eventId" => $eventId,
                    "type" => $file->getClientOriginalExtension(),
                    "doc" => $filePath,
                    "userId" => Auth::user()->id,
                ]);
            }
            DB::commit();
            return redirect()->back();
        } catch (\Exception $error) {
            dd($error);
            DB::rollback();
            return redirect()->back()->withErrors();
        }
    }

    public function lpj(Request $request)
    {
        $data = $request->validate([
            "id" => "required",
            "lpj" => "required|file|mimes:pdf",
        ]);
        $event = Events::with("ormawa")->find($data["id"]);
        if (!$event) {
            abort(404);
        }
        $currentTime = now()->timestamp;
        $lpjName =
            "lpj" .
            $event->id .
            "_" .
            $currentTime .
            "." .
            $request->file("lpj")->getClientOriginalExtension();
        $lpjPath = $request->file("lpj")->storeAs("lpj", $lpjName, "public");

        $event->active = false;
        $event->lpj = $lpjPath;
        $event->finishedAt = now();
        $event->save();

        return redirect()->back();
    }
    public function approve(Request $request)
    {
        $data = $request->validate([
            "id" => "required",
            "action" => "required",
        ]);
        $participant = Registration::find($data["id"]);
        if (!$participant) {
            abort(404);
        }
        $participant->isApproved = $data["action"];
        $participant->save();
        return response()->json(["status" => "ok"]);
    }
    public function active($id)
    {
        $event = Events::find($id);
        $event->active = !$event->active;
        $event->save();

        return response()->json(["status" => "ok"]);
    }
    public function view($token)
    {
        $event = Events::where("token", $token)
            ->with("ormawa", "creator", "participant", "feedback", "docs")
            ->first();

        return Inertia::render("Events/View", ["event" => $event]);
    }
    public function update(Request $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->all();
            $event = Events::findOrFail($data["id"]);
            unset(
                $data["id"],
                $data["ormawa"],
                $data["ormawaId"],
                $data["poster"],
                $data["token"]
            );

            if ($request->hasFile("poster")) {
                $currentTime = now()->timestamp;
                $imageName =
                    "event" .
                    $event->id .
                    "_" .
                    $currentTime .
                    "." .
                    $request->file("poster")->getClientOriginalExtension();
                $imagePath = $request
                    ->file("poster")
                    ->storeAs("events", $imageName, "public");
                $data["poster"] = $imagePath;
            }
            $data["createdBy"] = Auth::user()->id;
            $event->update($data);
            DB::commit();
            return redirect()
                ->back()
                ->with("success", "Event updated successfully");
        } catch (\Exception $err) {
            DB::rollback();
            return redirect()->back()->withErrors()->withInput();
        }
    }
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
        $data["isApproved"] = true;
        Registration::create($data);
        return redirect()->back()->with("success", "Registered successfully");
    }
    public function inspect($token)
    {
        $event = Events::where("token", $token)
            ->where("active", true)
            ->with("ormawa")
            ->first();
        if (!$event) {
            abort(404);
        }

        return Inertia::render("Events/Register", ["event" => $event]);
    }
    public function adminfeedback(Request $request)
    {
        $data = $request->validate([
            "feedback" => "required|string",
            "eventId" => "required",
        ]);

        $event = Events::find($data["eventId"]);

        $event->adminFeedback = $data["feedback"];
        $event->save();

        return redirect()->back();
    }
    public function feedback(Request $request)
    {
        $data = $request->validate([
            "eventId" => "required",
            "feedback" => "required",
            "name" => "",
            "email" => "",
        ]);

        $event = Events::findOrFail($data["eventId"]);

        Feedback::create($data);
        return redirect()->back()->with("success", "feedback is sent");
    }
    public function index()
    {
        $events = [];
        if (Auth::user()->role === "admin") {
            $events = Events::with("ormawa")
                ->orderBy("created_at", "desc")
                ->get();
        } else {
            $events = Events::where("ormawaId", Auth::user()->ormawaId)
                ->with("ormawa")
                ->orderBy("created_at", "desc")
                ->get();
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
                "waGroup" => "required|string",
                "price" => "required",
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
            $data["token"] = Str::random(10);
            $data["poster"] = $imagePath;
            $data["ormawaId"] = Auth::user()->ormawaId;
            $data["createdBy"] = Auth::user()->id;
            $newEvent = Events::create($data);
            DB::commit();
            return redirect()
                ->back()
                ->with("success", "Event created successfully");
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
