<?php

namespace App\Http\Controllers;

use App\Http\Requests\BarangHilangRequest;
use App\Http\Resources\BarangHilangResource;
use App\Models\BarangHilang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class BarangHilangController extends Controller
{
    public function index(Request $req)
    {
        $builder = new BarangHilang();

        if ($req->user_id != null) {
            $builder = $builder->where('user_id', $req->user_id);
        }

        if ($req->ditemukan != null) {
            $builder = $builder->where('ditemukan', $req->ditemukan);
        }

        if ($req->hadiah_min != null) {
            $builder = $builder->where('hadiah', '>=', $req->hadiah_min);
        }

        if ($req->hadiah_max != null) {
            $builder = $builder->where('hadiah', '<=', $req->hadiah_max);
        }

        try {
            $terdekat = @explode(',', $req->terdekat);

            $lat = $terdekat[0];
            $lng = $terdekat[1];

            $km = 0.010000000000000; // 1 km

            $builder = $builder->where(function ($query) use ($lat, $lng, $km) {
                return $query->where('maps_lat', '<=', $lat + $km)
                    ->where('maps_lat', '>=', $lat - $km);
            });

            $builder = $builder->where(function ($query) use ($lat, $lng, $km) {
                return $query->where('maps_lng', '<=', $lng + $km)
                    ->where('maps_lng', '>=', $lng - $km);
            });
        } catch (\Exception $e) {
            if ($req->terdekat) {
                return Response::json([
                    'message' => 'latitude dan longitude tidak valid'
                ], 400);
            }
        }

        if ($search = $req->search) {
            $builder = $builder->where(function ($query) use ($search) {
                return $query->where('nama', 'like', "%$search%")
                    ->orWhere('deskripsi', 'like', "%$search%")
                    ->orWhere('tempat_hilang', 'like', "%$search%")
                    ->orWhere('hadiah', 'like', "%$search%");
            });
        }

        if ($orderBy = $req->orderBy) {
            $builder = $builder->orderBy($orderBy);
        } else {
            $builder = $builder->orderBy('created_at', 'desc');
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
            $data['foto'] = $this->uploadBase64($req->foto, 'barang-hilang', 'jpg');
        }

        $item = BarangHilang::create($data);

        return new BarangHilangResource($item);
    }

    public function update(BarangHilangRequest $req, $id)
    {
        $item = BarangHilang::find($id);
        $data = $req->validated();

        if ($req->foto) {
            $data['foto'] = $this->uploadBase64($req->foto, 'barang-hilang', 'jpg');
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
