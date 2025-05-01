<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrmawaController;
use App\Http\Controllers\UserController;
use Inertia\Inertia;

Route::get("/", function () {
    return Inertia::render("Form/Login", []);
});
Route::get("/login", function () {
    return Inertia::render("Form/Login", []);
});
Route::prefix("user")->group(function () {
    Route::post("/login", [UserController::class, "signin"]);
    Route::post("/create", [UserController::class, "store"]);
});
Route::middleware(["auth"])->group(function () {
    Route::get("/dashboard", function () {
        return Inertia::render("Hello", []);
    });
    Route::prefix("org")->group(function () {
        Route::post("/create", [OrmawaController::class, "store"]);
    });
    Route::prefix("invites")->group(function () {
        Route::post("/create", [UserController::class, "store"]);
    });
});
