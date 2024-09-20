<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Message;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('users', function (){
        return User::query()->whereNot('id', auth()->id())->get();
    });
});

Route::get('event', function (){
    $event = \App\Events\SentMessage::dispatch('Hello World');
    return [
      "status" => true,
      "message" => $event
    ];
});

Route::get('messages/{friend}', function (User $friend){
    return Message::query()
        ->with('sender', 'receiver')
        ->orWhere(function ($query) use ($friend){
            $query->where('sender_id', auth()->id())
                ->where('receiver_id', $friend->id);
        })->orWhere(function ($query) use ($friend) {
            $query->where('receiver_id', auth()->id())
                ->where('sender_id', $friend->id);
        })
        ->orderBy('created_at')
        ->get();
});
Route::post('messages', function (\Illuminate\Http\Request $request){
    try {
        \App\Models\Message::create($request->all());
        $response = [
            "status" => true,
            "message" => "Message sent!"
        ];
        \App\Events\SentMessage::dispatch($request->sender_id,$request->receiver_id,$request->message);
    }catch (Throwable $exception){
        $response = [
            "status" => false,
            "message" => $exception->getMessage()
        ];
    }
   return response()->json($response);
});

require __DIR__.'/auth.php';
