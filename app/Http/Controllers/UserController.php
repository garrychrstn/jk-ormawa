<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Invites;
use App\Models\Events;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function catalogue()
    {
        $events = Events::where("eventEnd", ">", now())
            ->with("ormawa")
            ->orderBy("eventEnd", "asc")
            ->get();
    }
    public function dashboard()
    {
        $user = $user = Auth::user();
        if ($user->role === "admin") {
            return Inertia::render("DashboardAdmin");
        } else {
            return Inertia::render("Dashboard");
        }
    }
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
                ->withErrors("Invalid Credentials")
                ->withInput();
        }
        if (
            Auth::attempt([
                "email" => $data["email"],
                "password" => $data["password"],
            ])
        ) {
            $request->session()->regenerate();
            if ($user->role !== "user") {
                return redirect("/dashboard");
            } else {
                return redirect("/");
            }
        } else {
            return redirect()
                ->back()
                ->withErrors("Invalid Credentials")
                ->withInput();
        }
    }
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validate([
                "name" => "required",
                "email" => "required|email",
                "password" => "required|min:8",
                "token" => "string|max:255",
            ]);
            // Check if any users exist in the system
            $userCount = User::count();
            $isFirstUser = $userCount === 0;

            // If this is the first user, make them an admin
            if ($isFirstUser) {
                $data["role"] = "admin";
            } else {
                if (!isset($data["token"])) {
                    $data["role"] = "user";
                } else {
                    $token = Invites::where("token", $data["token"])->first();
                    $data["role"] = "ormawa";
                    if ($token->role === "pj") {
                        $data["isPj"] = true;
                    } else {
                        $data["isPj"] = false;
                    }
                    $data["ormawaId"] = $token->ormawaId;
                    $token->status = "used";
                    $token->save();
                }
            }
            $data["password"] = bcrypt($data["password"]);
            $user = User::create($data);
            Auth::login($user);
            DB::commit();
            return redirect("/");
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()
                ->back()
                ->withErrors([
                    "error" => "Registration failed: " . $e->getMessage(),
                ])
                ->withInput();
        }
    }
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect("/");
    }
}
