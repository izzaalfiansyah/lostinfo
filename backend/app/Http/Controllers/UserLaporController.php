<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserLaporRequest;
use App\Http\Resources\UserLaporResource;
use App\Models\UserLapor;
use Illuminate\Http\Request;

class UserLaporController extends Controller
{
    public function index(Request $req)
    {
        $builder = new UserLapor();

        if ($user_id = $req->user_id) {
            $builder = $builder->where('user_id', $user_id);
        }

        $items = $builder->get();

        return UserLaporResource::collection($items);
    }

    public function store(UserLaporRequest $req)
    {
        $data = $req->validated();

        $item = UserLapor::create($data);

        return new UserLaporResource($item);
    }

    public function update(UserLaporRequest $req, $id)
    {
        $item = UserLapor::find($id);
        $data = $req->validated();

        $item?->update($data);

        return new UserLaporResource($item);
    }

    public function destroy($id)
    {
        $item = UserLapor::find($id);

        $item?->delete();

        return new UserLaporResource($item);
    }
}
