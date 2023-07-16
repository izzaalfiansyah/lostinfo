<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index(Request $req)
    {
        $builder = new User();

        if ($role = $req->role) {
            $builder = $builder->where('role', $role);
        }

        if ($status = $req->status) {
            $builder = $builder->where('status', $status);
        }

        if ($search = $req->search) {
            $builder = $builder->where(function ($query) use ($search) {
                return $query->where('username', 'like', "%$search%")
                    ->orWhere('nama', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");
            });
        }

        $items = $builder->paginate($req->limit ?: 10);

        return UserResource::collection($items);
    }

    function show($id)
    {
        $item = User::find($id);

        return new UserResource($item);
    }

    public function store(UserRequest $req)
    {
        $data = $req->validated();

        $data['password'] = Hash::make($req->password);
        $data['ktp'] = $this->uploadBase64($req->ktp, 'user-ktp', 'png');

        if ($req->foto) {
            $data['foto'] = $this->uploadBase64($req->foto, 'user', 'png');
        }

        $item = User::create($data);

        return new UserResource($item);
    }

    public function update(UserRequest $req, $id)
    {
        $data = $req->validated();

        $item = User::find($id);

        if ($req->password) {
            $data['password'] = Hash::make($req->password);
        } else {
            unset($data['password']);
        }

        if ($req->foto) {
            $data['foto'] = $this->uploadBase64($req->foto, 'user', 'png');
            @unlink(public_path($item->foto));
        } else {
            unset($data['foto']);
        }

        if ($req->ktp) {
            $data['ktp'] = $this->uploadBase64($req->ktp, 'user-ktp', 'png');
            @unlink(public_path($item->ktp));
        } else {
            unset($data['ktp']);
        }

        $item?->update($data);

        return new UserResource($item);
    }

    public function destroy($id)
    {
        $item = User::find($id);

        @unlink(public_path($item->foto));

        $item?->delete();

        return new UserResource($item);
    }

    public function login(Request $req)
    {
        $schema = Validator::make($req->all(), [
            'username' => 'required',
            'password' => 'required',
        ]);

        if ($schema->fails()) {
            return Response([
                'data' => $schema->errors(),
                'message' => $schema->errors()->first(),
            ], 400);
        }

        $items = User::where('username', $req->username)->get();

        if (count($items) > 0) {
            foreach ($items as $key => $item) {
                if (Hash::check($req->password, $item->password)) {
                    return new UserResource($item);
                }
            }

            return Response([
                'data' => [],
                'message' => 'password salah',
            ], 400);
        } else {
            return Response([
                'data' => [],
                'message' => 'username tidak ditemukan',
            ], 400);
        }
    }
}
