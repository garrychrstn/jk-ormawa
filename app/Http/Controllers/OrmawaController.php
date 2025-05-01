<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class OrmawaController extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validate([
                "name" => "required|string|max:255",
                "description" => "string|max:255",
                "logo" => "image|mimes:jpeg,png,jpg,gif,svg|max:2048",
            ]);

            $imageName =
                explode(" ", trim($data["name"]))[0] .
                "." .
                $request->file("logo")->getClientOriginalExtension();

            $imagePath = $request
                ->file("logo")
                ->storeAs("images/logo", $imageName, "public");
            $data["logo"] = $imagePath;
            Item::create($data);
            $ormawa = Ormawa::create($data);

            DB::commit();
            return response()->json($ormawa, 200);
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with("error", "Failed to create Ormawa");
        }
    }
}
