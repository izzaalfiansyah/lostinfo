<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChatRequest;
use App\Http\Resources\ChatResource;
use App\Models\Chat;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index(Request $req)
    {
        $builder = new Chat();

        if ($user_id = $req->user_id) {
            $builder = $builder->where('user_1_id', $user_id)->orWhere('user_2_id', $user_id);
        }

        $items = $builder->get();

        return new ChatResource($items);
    }

    public function store(ChatRequest $req)
    {
        $data = $req->validated();

        $item = Chat::create($data);

        return new ChatResource($item);
    }

    public function update(ChatRequest $req, $id)
    {
        $item = Chat::find($id);
        $data = $req->validated();

        $item?->update($data);

        return new ChatResource($item);
    }

    public function destroy($id)
    {
        $item = Chat::find($id);

        $item?->delete();

        return new ChatResource($item);
    }
}
