<?php

namespace App\Http\Controllers;

use App\Http\Requests\BarangTemuRequest;
use App\Http\Resources\BarangTemuResource;
use App\Models\BarangHilang;
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

        if ($req->barang_hilang_id != null) {
            $barang_hilang = BarangHilang::find($req->barang_hilang_id);

            if ($barang_hilang) {
                $list_nama = explode(' ', $barang_hilang->nama);
                $list_deskripsi = explode(' ', $barang_hilang->deskripsi);
                $list_tempat_hilang = explode(' ', $barang_hilang->tempat_hilang);

                $builder = $builder->where(function ($query) use ($list_nama) {
                    foreach ($list_nama as $nama) {
                        if (strlen($nama) > 2) {
                            $query = $query->orWhere('nama', 'like', "%$nama%");
                        }
                    }

                    return $query;
                });

                $builder = $builder->orWhere(function ($query) use ($list_deskripsi) {
                    foreach ($list_deskripsi as $deskripsi) {
                        if (strlen($deskripsi) > 2) {
                            $query = $query->orWhere('deskripsi', 'like', "%$deskripsi%");
                        }
                    }

                    return $query;
                });

                $builder = $builder->where(function ($query) use ($list_tempat_hilang) {
                    foreach ($list_tempat_hilang as $tempat_hilang) {
                        if (strlen($tempat_hilang) > 2) {
                            $query = $query->orWhere('tempat_temu', 'like', "%$tempat_hilang%");
                        }
                    }

                    return $query;
                });

                if ($barang_hilang->maps_lat != null) {
                    $req->merge(['terdekat' => "$barang_hilang->maps_lat,$barang_hilang->maps_lng"]);
                }
            }
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

    function total(Request $req)
    {
        $tahun = date('Y');

        if ($req->tahun != null) {
            $tahun = $req->tahun;
        }

        $total = BarangTemu::whereYear('created_at', $tahun)->count();

        return [
            'data' => $total,
        ];
    }
}
