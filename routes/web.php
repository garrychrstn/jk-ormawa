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
    Route::get("/view/{token}", [EventController::class, "inspect"]);
    Route::post("/register", [EventController::class, "join"]);
    Route::post("/feedback", [EventController::class, "feedback"]);
});

Route::middleware(["auth", "isOrmawa"])->group(function () {
    Route::get("/dashboard", [UserController::class, "dashboard"]);
    Route::prefix("member")->group(function () {
        Route::get("/", [UserController::class, "member"]);
    });
    Route::prefix("ormawa")->group(function () {
        Route::get("/", [OrmawaController::class, "index"]);
        Route::post("/create", [OrmawaController::class, "store"])->middleware(
            "isAdmin"
        );
    });
    Route::prefix("/invites")->group(function () {
        Route::get("/", [InviteController::class, "index"]);
        Route::post("/create", [InviteController::class, "store"]);
    });
    Route::prefix("/event")->group(function () {
        Route::get("/", [EventController::class, "index"]);
        Route::post("/approve/", [EventController::class, "approve"]);
        Route::post("/update", [EventController::class, "update"]);
        Route::post("/create", [EventController::class, "store"]);
        Route::post("/active/{id}", [EventController::class, "active"]);
        Route::post("/lpj", [EventController::class, "lpj"]);
        Route::get("/{token}", [EventController::class, "view"]);
    });
});
