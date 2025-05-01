<?php

namespace App\Http\Controllers;

use App\Models\Ormawa;
use App\Models\User;
use App\Models\Invites;
use Illuminate\Http\Request;

class InvitesController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            "role" => "required|string",
            "ormawaId" => "required|exists:ormawas,id",
        ]);
        $data["createdBy"] = auth()->user()->id;
        $data["token"] = bin2hex(random_bytes(32));
        $invite = Invites::create($data);
        return response()->json($invite, 201);
    }
    public function index()
    {
        $invites = Invites::all();
        return response()->json($invites, 200);
    }
}
