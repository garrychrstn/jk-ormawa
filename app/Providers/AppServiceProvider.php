<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            "auth" => fn() => [
                "user" => Auth::user()
                    ? [
                        "role" => Auth::user()->role,
                        "name" => Auth::user()->name,
                        "email" => Auth::user()->email,
                        "ormawa" => Auth::user()->ormawa,
                    ]
                    : null,
            ],
        ]);
    }
}
