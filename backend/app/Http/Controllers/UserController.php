<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Mail\VerifyUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\View;

class UserController extends Controller
{
    public function index(Request $req)
    {
        $builder = new User();

        if ($req->role != null) {
            $builder = $builder->where('role', $req->role);
        }

        if ($req->status != null) {
            $builder = $builder->where('status', $req->status);
        }

        if ($search = $req->search) {
            $builder = $builder->where(function ($query) use ($search) {
                return $query->where('username', 'like', "%$search%")
                    ->orWhere('nama', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");
            });
        }

        $items = $builder->orderBy('created_at', 'desc')->paginate($req->limit ?: 10);

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
        $data['remember_token'] = date('YmdHis');

        if ($req->foto) {
            $data['foto'] = $this->uploadBase64($req->foto, 'user', 'png');
        }

        $item = User::create($data);
        $this->sendVerifikasi($item->id);

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

        $items = User::where('username', $req->username)->orWhere('email', $req->email)->get();

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

    public function verifikasi($id)
    {
        $item = User::where(DB::raw('md5(id)'), base64_decode($id))->first();

        if ($item) {
            $item->update(['status' => '1']);
            return view('user.verifikasi_sukses', ['user' => $item]);
        } else {
            return view('user.verifikasi_gagal');
        }
    }

    public function sendVerifikasi($id)
    {
        $item = User::find($id);
        Mail::to($item)->send(new VerifyUser($item));

        return new UserResource($item);
    }
}
