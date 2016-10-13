using RS.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Omnia.Controllers
{
    public class PageDesignerController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}