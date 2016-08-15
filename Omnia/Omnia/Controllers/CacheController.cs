using Omnia.BL;
using Omnia.Common;
using RS.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Omnia.Controllers
{
    public class CacheController : BaseController
    {
        public ActionResult Clear()
        {
            AccessTokensManager.Instance.Clear();
            CacheAccessor.Clear();

            return View();
        }
    }
}
