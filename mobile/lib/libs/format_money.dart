import 'package:intl/intl.dart';

formatMoney(dynamic val) {
  NumberFormat currencyFormatter =
      NumberFormat.currency(locale: 'id', symbol: 'Rp ');

  return currencyFormatter.format(val);
}
