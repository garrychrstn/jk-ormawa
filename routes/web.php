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
})->name("login");
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
    Route::post("/logout", [UserController::class, "logout"]);
    Route::get("/dashboard", [UserController::class, "dashboard"]);
    Route::prefix("member")->group(function () {
        Route::get("/", [UserController::class, "member"]);
        Route::post("/deactivate", [UserController::class, "deactivate"]);
    });

    Route::prefix("ormawa")->group(function () {
        Route::get("/", [OrmawaController::class, "index"])->middleware(
            "isAdmin"
        );
        Route::get("/view/{id}", [OrmawaController::class, "view"])->middleware(
            "isAdmin"
        );
        Route::post("/create", [OrmawaController::class, "store"])->middleware(
            "isAdmin"
        );
        Route::post("/update", [OrmawaController::class, "update"]);
    });
    Route::prefix("/invites")->group(function () {
        Route::get("/", [InviteController::class, "index"]);
        Route::post("/create", [InviteController::class, "store"]);
        Route::get("/delete/{id}", [InviteController::class, "delete"]);
    });
    Route::prefix("/event")->group(function () {
        Route::get("/", [EventController::class, "index"]);
        Route::post("/documentation", [
            EventController::class,
            "documentation",
        ]);
        Route::post("/adminfeedback", [
            EventController::class,
            "adminfeedback",
        ])->middleware("isAdmin");
        Route::post("/approve/", [EventController::class, "approve"]);
        Route::post("/update", [EventController::class, "update"]);
        Route::post("/create", [EventController::class, "store"]);
        Route::post("/active/{id}", [EventController::class, "active"]);
        Route::post("/lpj", [EventController::class, "lpj"]);
        Route::get("/{token}", [EventController::class, "view"]);
    });
});
