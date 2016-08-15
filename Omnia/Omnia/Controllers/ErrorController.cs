using Omnia.Common;
using RS.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Omnia.Controllers
{
    public class ErrorController : Controller
    {
        public ActionResult Index()
        {
            string message = (SessionAccessor.Error ?? string.Empty).ToString();

            var model = new Models.ErrorPage()
            {
                Message = message
            };

            SessionAccessor.Error = null;

            return View(model);
        }
    }
}
