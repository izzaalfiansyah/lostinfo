<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class GrafikController extends Controller
{
    const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    public function barang(Request $req)
    {
        $tahun = $req->tahun ?: date('Y');
        $status = $req->status;

        // generate bulan per tahun
        foreach ($this::bulan as $key => $bulan) {
            $dataPerbulan[] = [
                'bulan' => $bulan,
                'bulan_ke' => $key + 1,
                'jumlah' => 0,
            ];
        }

        // set value per bulan barang hilang
        $barang_hilang = DB::table('barang_hilang')
            ->select(
                DB::raw('count(id) as jumlah'),
                DB::raw('cast(date_format(created_at, "%m") as unsigned) as bulan')
            )
            ->whereYear('created_at', '=', $tahun)
            ->groupBy('bulan')
            ->get();

        $data_perbulan_barang_hilang = array_merge($dataPerbulan);

        foreach ($barang_hilang as $item) {
            $data_perbulan_barang_hilang[$item->bulan - 1]['jumlah'] = $item->jumlah;
        }

        $barang_temu = DB::table('barang_temu')
            ->select(
                DB::raw('count(id) as jumlah'),
                DB::raw('cast(date_format(created_at, "%m") as unsigned) as bulan')
            )
            ->whereYear('created_at', '=', $tahun)
            ->groupBy('bulan')
            ->get();

        // set value per bulan barang temu
        $barang_temu = DB::table('barang_temu')
            ->select(
                DB::raw('count(id) as jumlah'),
                DB::raw('cast(date_format(created_at, "%m") as unsigned) as bulan')
            )
            ->whereYear('created_at', '=', $tahun)
            ->groupBy('bulan')
            ->get();

        $data_perbulan_barang_temu = array_merge($dataPerbulan);

        foreach ($barang_temu as $item) {
            $data_perbulan_barang_temu[$item->bulan - 1]['jumlah'] = $item->jumlah;
        }

        $barang_temu = DB::table('barang_temu')
            ->select(
                DB::raw('count(id) as jumlah'),
                DB::raw('cast(date_format(created_at, "%m") as unsigned) as bulan')
            )
            ->whereYear('created_at', '=', $tahun)
            ->groupBy('bulan')
            ->get();

        return new Response([
            'data' => [
                'barang_hilang' => $data_perbulan_barang_hilang,
                'barang_temu' => $data_perbulan_barang_temu,
            ]
        ]);
    }
}
