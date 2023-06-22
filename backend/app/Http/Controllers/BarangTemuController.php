<?php

namespace App\Http\Controllers;

use App\Http\Requests\BarangTemuRequest;
use App\Http\Resources\BarangTemuResource;
use App\Models\BarangTemu;
use Illuminate\Http\Request;

class BarangTemuController extends Controller
{
    public function index(Request $req)
    {
        $builder = new BarangTemu();

        if ($user_id = $req->user_id) {
            $builder = $builder->where('user_id', $user_id);
        }

        if ($ditemukan = $req->ditemukan) {
            $builder = $builder->where('ditemukan', $ditemukan);
        }

        if ($search = $req->search) {
            $builder = $builder->where(function ($query) use ($search) {
                return $query->where('nama', 'like', "%$search%")
                    ->orWhere('deskripsi', 'like', "%$search%")
                    ->orWhere('tempat_hilang', 'like', "%$search%")
                    ->orWhere('hadiah', 'like', "%$search%");
            });
        }

        $items = $builder->paginate($req->limit ?: 10);

        return BarangTemuResource::collection($items);
    }

    function show($id)
    {
        $item = BarangTemu::find($id);

        return new BarangTemuResource($item);
    }

    public function store(BarangTemuRequest $req)
    {
        $data = $req->validated();

        if ($req->foto) {
            $data['foto'] = $this->uploadBase64($req->foto, 'barang-temu', 'jpg');
        }

        $item = BarangTemu::create($data);

        return new BarangTemuResource($item);
    }

    public function update(BarangTemuRequest $req, $id)
    {
        $item = BarangTemu::find($id);
        $data = $req->validated();

        if ($req->foto) {
            $data['foto'] = $this->uploadBase64($req->foto, 'barang-temu', 'jpg');
            @unlink(public_path($item->foto));
        } else {
            unset($data['foto']);
        }

        $item?->update($data);

        return new BarangTemuResource($item);
    }

    public function destroy($id)
    {
        $item = BarangTemu::find($id);

        @unlink(public_path($item->foto));
        $item?->delete();

        return new BarangTemuResource($item);
    }
}
