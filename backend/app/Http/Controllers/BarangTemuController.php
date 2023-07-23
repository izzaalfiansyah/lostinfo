<?php

namespace App\Http\Controllers;

use App\Http\Requests\BarangTemuRequest;
use App\Http\Resources\BarangTemuResource;
use App\Models\BarangTemu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class BarangTemuController extends Controller
{
    public function index(Request $req)
    {
        $builder = new BarangTemu();

        if ($req->user_id != null) {
            $builder = $builder->where('user_id', $req->user_id);
        }

        if ($req->dikembalikan != null) {
            $builder = $builder->where('dikembalikan', $req->dikembalikan);
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
                    ->orWhere('tempat_temu', 'like', "%$search%");
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
