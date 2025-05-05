<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Ormawa;
use Inertia\Inertia;

class OrmawaController extends Controller
{
    public function index()
    {
        $ormawas = Ormawa::all();
        return Inertia::render("Ormawa/Index", ["ormawas" => $ormawas]);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validate([
                "name" => "required|string|max:255",
                "description" => "string|max:255",
                "logo" => "image|mimes:jpeg,png,jpg,gif,svg|max:2048",
            ]);
            if ($request->hasFile("logo")) {
                $imageName =
                    explode(" ", trim($data["name"]))[0] .
                    "." .
                    $request->file("logo")->getClientOriginalExtension();

                $imagePath = $request
                    ->file("logo")
                    ->storeAs("images/logo", $imageName, "public");
                $data["logo"] = $imagePath;
            }
            $ormawa = Ormawa::create($data);
            DB::commit();
            return redirect()
                ->back()
                ->with("success", "Ormawa created successfully");
        } catch (\Exception $e) {
            dd($e->getMessage());
            DB::rollback();
            return redirect()->back()->with("error", "Failed to create Ormawa");
        }
    }
}
