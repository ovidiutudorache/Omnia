using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Omnia.WebTest.Controllers
{
    public class HomeController : BaseController
    {
        public static DM.AuthenticatedUser user = null;

        public ActionResult Index()
        {
            var model = new Models.HomePage()
            {
                FacebookUrl = Omnia.GenerateExternalLoginUri("facebook").ToString(),
                InstagramUrl = Omnia.GenerateExternalLoginUri("instagram").ToString(),
                User = user
            };

            return View(model);
        }

        public ActionResult Authenticated(string code)
        {
            user = Omnia.GetAccessToken(code);

            return RedirectToAction("Index");
        }
    }
}