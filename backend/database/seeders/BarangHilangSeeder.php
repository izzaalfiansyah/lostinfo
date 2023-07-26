<?php

namespace Database\Seeders;

use App\Models\BarangHilang;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BarangHilangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');

        for ($i = 0; $i < 200; $i++) {
            $data[] = [
                'user_id' => random_int(232, 342),
                'nama' => ["Natrum Muriaticum Kit Refill", "Doxycycline Hyclate", "Alendronate Sodium", "Amoxicillin", "All Day Allergy", "Naturasil", "Bay Leaf", "Bronchial Cough", "RAZADYNE", "Prednisone", "Green Pea", "Anti Diarrheal", "Hydrocortisone Plus", "LiquiTears", "Exuviance Multi Protective Day", "Megestrol Acetate", "Dallergy", "Treatment Set TS345463", "BOTRYTIS CINEREA", "DiorSkin Nude 022 Cameo", "Tamiflu", "PINUS STROBUS POLLEN", "Anxiety HP", "Ceftriaxone Sodium", "Depo-Testosterone", "DUAL ACTION CHERRY COUGH SUPPRESSANT ORAL ANESTHETIC", "Doxazosin", "LE TECHNIQ", "Levothyroxine Sodium", "Hand Sanitizer", "Phenobarbital", "Tigan", "MEDI-FIRST Non-Aspirin Extra Strength", "Purell Advanced Hand Sanitizer Revitalizing Rain", "CellCept", "Metformin Hydrochloride", "VANILLA", "ciprofloxacin", "Bumetanide", "FLEXBUMIN", "Neutrogena Men", "Sun Shades Lip Balm", "Imari Seduction", "METOZOLV", "Speed Stick", "Ultra Lubricant Eye Drops", "Propranolol Hydrochloride", "Metoprolol Tartrate", "simvastatin", "preferred plus nicotine", "Equaline childrens pain and fever", "Escitalopram", "Escitalopram", "White Pine", "Laura Mercier Tinted Moisturizer SPF 20 FAWN", "Levetiracetam", "BSS PLUS", "Fluticasone Propionate", "LOreal Paris Advanced Suncare Invisible Protect Sheer 30 Broad Spectrum SPF 30 Sunscreen", "Stemphylium sarciniforms", "Penicillin V Potassium", "Fluticasone Propionate", "Amlodipine besylate and Atorvastatin calcium", "Escitalopram Oxalate", "Goodys Headache Relief Shot", "Irbesartan", "Benzoyl Peroxide", "QVAR", "Sweat-Less", "Bio Gentian", "RESTORIL", "Diphenhydramine Hydrochloride", "Oxygen", "ALAVERT ALLERGY", "Berry Scented Hand Sanitizer", "Family Care Thera Flex", "Furosemide", "Oxybutynin Chloride", "Carisoprodol", "PCOS", "dg health omeprazole", "Ofloxacin", "Sodium Sulfacetamide", "Carbidopa, Levodopa and Entacapone", "Goodys Headache Relief Shot", "Clonidine Hydrochloride", "GLYBURIDE AND METFORMIN HYDROCHLORIDE", "Zicam", "OXYGEN", "DiaBeta", "Promethazine Hydrochloride", "Androxy", "Perform", "glimepiride", "Sensorcaine", "AMILORIDE HYDROCHLORIDE", "Tizanidine Hydrochloride", "Olanzapine", "PENICILLIN G PROCAINE", "Adult Low Dose Aspirin"][random_int(0, 99)],
                'deskripsi' => '',
                'tempat_hilang' => $faker->address(),
                'hadiah' => random_int(100, 900) * 1000,
                'ditemukan' => ['1', '0'][random_int(0, 1)],
            ];
        }

        BarangHilang::insert($data);
    }
}
