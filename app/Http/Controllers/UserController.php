<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Invites;
use App\Models\Events;
use App\Models\Ormawa;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function logout()
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect("/login");
    }
    public function deactivate(Request $request)
    {
        $data = $request->validate([
            "id" => "required",
        ]);

        $user = User::find($data["id"]);
        $user->delete();

        return response()->json(["status" => "ok"]);
    }
    public function member()
    {
        $member = User::where("role", "ormawa")
            ->where("ormawaId", Auth::user()->ormawaId)
            ->get();
        $invites = Invites::where("ormawaId", Auth::user()->ormawaId)->get();
        return Inertia::render("Ormawa/Member", [
            "member" => $member,
            "invites" => $invites,
        ]);
    }
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
            $events = Events::with("participant", "ormawa")
                ->where("active", true)
                ->get();
            $ormawa = Ormawa::with("members")->get();
            $totalEvents = Events::count();
            $recentEvents = Events::where("finishedAt", ">", now()->subDays(7))
                ->where("finishedAt", "<=", now())
                ->get();
            return Inertia::render("DashboardAdmin", [
                "events" => $events,
                "ormawa" => $ormawa,
                "totalEvents" => $totalEvents,
                "recentEvents" => $recentEvents,
            ]);
        } else {
            $ormawa = Ormawa::with("members")->find(Auth::user()->ormawaId);
            $events = Events::with("participant", "ormawa")
                ->where("ormawaId", "=", Auth::user()->ormawaId)
                ->where("active", true)
                ->get();
            $eventCount = Events::where(
                "ormawaId",
                Auth::user()->ormawaId
            )->count();
            $participantSum = Events::where("ormawaId", Auth::user()->ormawaId)
                ->with("participant")
                ->get()
                ->sum(function ($event) {
                    return $event->participant->count();
                });

            $participantAverage =
                $eventCount > 0 ? round($participantSum / $eventCount) : 0;
            return Inertia::render("Dashboard", [
                "ormawa" => $ormawa,
                "events" => $events,
                "eventCount" => $eventCount,
                "participantSum" => $participantSum,
                "participantAverage" => $participantAverage,
            ]);
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
}
