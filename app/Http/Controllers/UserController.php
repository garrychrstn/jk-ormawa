<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function signin(Request $request)
    {
        $data = $request->validate([
            "email" => "required",
            "password" => "required",
        ]);
        $user = User::where("email", $data["email"])->first();
        if (!$user) {
            return redirect()
                ->back()
                ->withErrors(["email" => "No user found"])
                ->withInput();
        }
        if (
            Auth::attempt([
                "email" => $data["email"],
                "password" => $data["password"],
            ])
        ) {
            $request->session()->regenerate();
            if ($user->role == "admin") {
                return redirect("/dashboard");
            } else {
                return redirect("/");
            }
        } else {
            return redirect()
                ->back()
                ->withErrors(["email" => "Invalid credentials"])
                ->withInput();
        }
    }
    public function signup(Request $request) {}
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect("/");
    }
}
