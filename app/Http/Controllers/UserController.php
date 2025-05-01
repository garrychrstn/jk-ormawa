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
            if ($user->role == "admin") {
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
                    $ormawa = Ormawa::where("token", $data["token"])
                        ->with("members")
                        ->first();
                    if (!$ormawa) {
                        DB::rollBack();
                        return redirect()
                            ->back()
                            ->withErrors(["token" => "Invalid token"])
                            ->withInput();
                    }
                    if ($ormawa->members->count() > 0) {
                        $data["isPj"] = false;
                    } else {
                        $data["isPj"] = true;
                    }
                    $data["role"] = "ormawa";
                    $data["ormawaId"] = $ormawa->id;
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
