<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Invites;
use App\Models\User;
use App\Models\Ormawa;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class InviteController extends Controller
{
    public function index(Request $request)
    {
        $id = $request->query("id");
        if ($id) {
            $invites = Invites::where("ormawaId", $id)->with("ormawa")->get();
            return response()->json($invites);
        }
    }
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validate([
                "ormawaId" => "required|string|max:255",
            ]);
            if (Auth::user()->role === "admin") {
                $data["role"] = "pj";
            } else {
                $data["role"] = "member";
            }
            $data["status"] = "pending";
            $data["createdBy"] = Auth::user()->id;
            $data["token"] = Str::random(16);
            $token = Invites::create($data);
            DB::commit();
            return response()->json($token);
        } catch (\Exception $e) {
            dd($e->getMessage());
            DB::rollback();
            return redirect()->back()->with("error", "Failed to create Ormawa");
        }
    }
}
