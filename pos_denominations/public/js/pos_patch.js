frappe.after_ajax(() => {
    frappe.router.on('change', () => {
        if (frappe.get_route()[0] === 'point-of-sale') {
            const waitForPOS = setInterval(() => {
                if (
                    typeof erpnext !== "undefined" &&
                    erpnext.PointOfSale &&
                    erpnext.PointOfSale.Controller &&
                    !erpnext.PointOfSale.Controller.prototype._patched_with_denominations
                ) {
                    clearInterval(waitForPOS);

                    const original = erpnext.PointOfSale.Controller.prototype.create_opening_voucher;

                    erpnext.PointOfSale.Controller.prototype.create_opening_voucher = function () {
                        original.call(this);

                        setTimeout(() => {
                            const dialog = frappe.ui.dialogs.slice(-1)[0];

                            if (dialog?.fields_dict?.balance_details) {
                                dialog.fields_dict.balance_details.df.fields.push({
                                    fieldtype: "Data",
                                    fieldname: "denomination_note",
                                    label: "Denomination Note",
                                    in_list_view: 1
                                });
                                dialog.fields_dict.balance_details.grid.refresh();
                                console.log("✅ Denomination Note column added to POS Opening Entry");
                            }
                        }, 500);
                    };

                    erpnext.PointOfSale.Controller.prototype._patched_with_denominations = true;
                }
            }, 300);
        }
    });
});
