var last_level=0;

function eccHeader()
{
    // Write the banner header
    document.write("<div class='header'>");
    document.write("    <h1>Edmonton Cycle Club</h1>");
    document.write("    <a href='home.html'><img src='./graphics/ecc_badge_170.jpg'></a>");
    document.write("</div>");
}

function eccMenu(cs1,cs2)
{
    // Write the menu. cs1 and cs2 refer to the current selection from the main menu and (if applicable) the cascade menu 

    //The basic menu is a nested list: the closing tags on each list item depend on whether we are going to stay within a menu level,
    //move from a main menu item to a cascade or vice versa.  This is controlled by comparing the 'menu_level' with the 'last_level',
    //and inserting the appropriate closing tags.  Initially set 'last_level' to 0 to indicate that there are no previous closing tags to insert.
    last_level=0;

    //Write the menu wrapper
    document.write("<div id='menu'>");
    document.write("    <ul>");
    
    //Write the menu lines
    menuLine(1,"Home","home.html","",cs1);
	menuLine(1,"Diary","diary.html","",cs1);
	menuLine(1,"Ride reports","#","",cs1);
	    menuLine(2,"2026","rides_2026.html","",cs2);
	    menuLine(2,"2025","rides_2025.html","",cs2);
	    menuLine(2,"2024","rides_2024.html","",cs2);
	    menuLine(2,"2023","rides_2023.html","",cs2);
	    menuLine(2,"2022","rides_2022.html","",cs2);
	    menuLine(2,"2021","rides_2021.html","",cs2);

	menuLine(1,"Guidance","#","",cs1);
	    menuLine(2,"Code of Conduct","conduct.html","",cs2);
	    menuLine(2,"Ride Leaders' Guide","leader.html","",cs2);

	menuLine(1,"Activities","#","",cs1);
	    menuLine(2,"Day rides","day_rides.html","",cs2);
	    menuLine(2,"Cycling Trips","weekends.html","",cs2);
	    menuLine(2,"Social","social.html","",cs2);
	    menuLine(2,"F.A.Q.","faq.html","",cs2);
	    menuLine(2,"Club history","history.html","",cs2);
	    menuLine(2,"Tools","tools.html","",cs2);

	menuLine(1,"Newsletters","#","",cs1);
        menuLine(2,"Autumn 2025","./documents/newsletter202510.pdf","_blank",cs2);
        menuLine(2,"Spring 2025","./documents/newsletter202503.pdf","_blank",cs2);
        menuLine(2,"Winter 2024/25","./documents/newsletter202411.pdf","_blank",cs2);
        menuLine(2,"Summer 2024","./documents/newsletter202407.pdf","_blank",cs2);

	menuLine(1,"AGM Minutes","#","",cs1);
	    menuLine(2,"November 2025","./documents/AGM2025.pdf","_blank",cs2);
	    menuLine(2,"November 2024","./documents/AGM2024.pdf","_blank",cs2);
	    menuLine(2,"November 2023","./documents/AGM2023.pdf","_blank",cs2);

	menuLine(1,"Links","#","",cs1);
	    menuLine(2,"Local","local_links.html","",cs2);
	    menuLine(2,"Internet","web_links.html","",cs2);

	menuLine(1,"Archive pages","archive.html","",cs1);
	menuLine(1,"Contact us","contact.html","",cs1);
    
    // Write the closing tags.
    document.write("</a></li>");
    document.write("    </ul>");
    document.write("</div>");
}

function menuLine(menu_level,menu_text,href,target,current_selection)
{
    // Write the closing tags for the previous menu line, then the current menu line
    var a=""
    
    // Closing tags for previous line
    if (last_level>0)
    {
        if (last_level==menu_level)
            a="</a></li>";
        else
        {
            if (menu_level==1)
                a="</a></li></ul></li>";
            else         
                a="</a><ul>";
        }
    }
    last_level=menu_level;
    
    //Add the opening tag, with a class selector if this is a curently selected item
    if (menu_text==current_selection)
       a=a+"<li class='current_selection'>";
    else
        a=a+"<li>";

    //Add the anchor href attribute, plus the target attribute if required
    a=a+"<a href='"+href+"'";
    if (target!="") 
        a=a+" target='"+target+"'";
    a=a+">";
    
    //Add the menu text, plus a down arrow if it is the parent of a cascade
    a=a+menu_text;
    if (href=="#")
        a=a+" &#x25BC;";

    //Write the completed line to the document
    document.write(a);
}
