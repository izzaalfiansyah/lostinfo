<?php

namespace App\Http\Controllers;

use App\Http\Requests\BarangHilangRequest;
use App\Http\Resources\BarangHilangResource;
use App\Models\BarangHilang;
use Illuminate\Http\Request;

class BarangHilangController extends Controller
{
    public function index(Request $req)
    {
        $builder = new BarangHilang();

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

        return BarangHilangResource::collection($items);
    }

    function show($id)
    {
        $item = BarangHilang::find($id);

        return new BarangHilangResource($item);
    }

    public function store(BarangHilangRequest $req)
    {
        $data = $req->validated();

        if ($req->foto) {
            $data['foto'] = $this->uploadBase64($req->foto, 'foto', 'jpg');
        }

        $item = BarangHilang::create($data);

        return new BarangHilangResource($item);
    }

    public function update(BarangHilangRequest $req, $id)
    {
        $item = BarangHilang::find($id);
        $data = $req->validated();

        if ($req->foto) {
            $data['foto'] = $this->uploadBase64($req->foto, 'foto', 'jpg');
            @unlink(public_path($item->foto));
        } else {
            unset($data['foto']);
        }

        $item?->update($data);

        return new BarangHilangResource($item);
    }

    public function destroy($id)
    {
        $item = BarangHilang::find($id);

        @unlink(public_path($item->foto));
        $item?->delete();

        return new BarangHilangResource($item);
    }
}
