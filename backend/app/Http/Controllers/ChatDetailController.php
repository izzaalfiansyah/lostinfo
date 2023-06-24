<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChatDetailRequest;
use App\Http\Resources\ChatDetailResource;
use App\Models\ChatDetail;
use Illuminate\Http\Request;

class ChatDetailController extends Controller
{
    public function index(Request $req)
    {
        $builder = new ChatDetail();

        if ($chat_id = $req->chat_id) {
            $builder = $builder->where('chat_id', $chat_id);
        }

        $builder = $builder->orderBy('created_at', 'desc');

        $items = $builder->get();

        return ChatDetailResource::collection($items);
    }

    public function store(ChatDetailRequest $req)
    {
        $data = $req->validated();

        if ($req->foto) {
            $data['foto'] = $this->uploadBase64($req->foto, 'chat', 'jpg');
        }

        $item = ChatDetail::create($data);

        return new ChatDetail($item);
    }

    public function destroy($id)
    {
        $item = ChatDetail::find($id);

        @unlink(public_path($item->foto));

        $item->delete();

        return new ChatDetail($item);
    }
}
