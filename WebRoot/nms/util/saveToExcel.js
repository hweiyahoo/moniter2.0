Ext.namespace("excel");

excel.saveToExcel = function(arrTitle, arrKey, arrData, arrJselect) {
      if (arrTitle && arrTitle.length > 0) {
         var exApp = new ActiveXObject("Excel.Application");
         var exBook = exApp.Workbooks.Add();
         var exSheet = exBook.ActiveSheet;
         for (var i = 0; i < arrTitle.length; i++) {
            exSheet.Cells(1, i + 1).value = arrTitle[i];
         }
         for (var j = 0; j < arrData.getCount(); j++) {
            var rec = arrData.getAt(j);
            for (var m = 0; m < arrKey.length; m++)
               exSheet.Cells(j + 2, m + 1).value = rec.get(arrKey[m]);
         }
         exApp.Visible = true;
         exApp.UserControl = true;
      }
      else {
         alert("传入的参数错误，请确认！");
         return;
      }
   }