import 'package:intl/intl.dart';

formatMoney(dynamic val) {
  NumberFormat currencyFormatter =
      NumberFormat.currency(locale: 'id', symbol: 'Rp ', decimalDigits: 0);

  return currencyFormatter.format(val);
}
