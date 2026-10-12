function textDate(date)
{
    // Return a full length date string ddth mmmm yyyy
    var dd=date.getDate();
    var mm=date.getMonth()+1;
    var yy=date.getFullYear();

    var a;

    switch(dd)
    {
        case 1:
        case 21:
        case 31:
            a=dd+'st';
            break;
        case 2:
        case 22:
            a=dd+'nd';
            break;
        case 3:
        case 23:
            a=dd+'rd';
            break;
        default:
            a=dd+'th';
            break;
    }

    switch(mm)
    {
        case 1: a=a+' January '; break;
        case 2: a=a+' February '; break;
        case 3: a=a+' March '; break;
        case 4: a=a+' April '; break;
        case 5: a=a+' May '; break;
        case 6: a=a+' June '; break;
        case 7: a=a+' July '; break;
        case 8: a=a+' August '; break;
        case 9: a=a+' September '; break;
        case 10: a=a+' October '; break;
        case 11: a=a+' November '; break;
        case 12: a=a+' December '; break;
   }

   a=a+yy;

   return a;
}


