<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InviteController;
use App\Http\Controllers\OrmawaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventController;
use Inertia\Inertia;

Route::get("/", [UserController::class, "catalogue"]);
Route::get("/login", function () {
    return Inertia::render("Form/Login", []);
});
Route::prefix("user")->group(function () {
    Route::post("/login", [UserController::class, "signin"]);
    Route::post("/create", [UserController::class, "store"]);
});

Route::prefix("/event")->group(function () {
    Route::get("/register/{token}", [EventController::class, "register"]);
    Route::post("/register", [EventController::class, "join"]);
});
Route::middleware(["auth", "isOrmawa"])->group(function () {
    Route::get("/dashboard", [UserController::class, "dashboard"]);
    Route::prefix("ormawa")->group(function () {
        Route::get("/", [OrmawaController::class, "index"]);
        Route::post("/create", [OrmawaController::class, "store"]);
    });
    Route::prefix("/invites")->group(function () {
        Route::get("/", [InviteController::class, "index"]);
        Route::post("/create", [InviteController::class, "store"]);
    });
    Route::prefix("/event")->group(function () {
        Route::get("/", [EventController::class, "index"]);
        Route::post("/update", [EventController::class, "update"]);
        Route::post("/create", [EventController::class, "store"]);
        Route::get("/{token}", [EventController::class, "view"]);
    });
});
