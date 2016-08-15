using OAuth2.Client;
using Omnia.Common;
using Omnia.DM;
using RS.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
using RS.Web.Extensions;
using RS.Common.Extensions;
using RS.Logger;

namespace Omnia.Controllers
{
    public class BaseController : Controller
    {
        protected override void OnException(ExceptionContext filterContext)
        {
            if (filterContext == null)
                base.OnException(filterContext);

            Log.Error(filterContext.Exception);

            bool isCustom = filterContext.Exception is HandledException;

            string errorMessage = null;

#if DEBUG
            errorMessage = filterContext.Exception.GetAllMessages();
#else
            errorMessage = isCustom ? filterContext.Exception.Message.ToString() : Resources.Static.Error_General;
#endif

            if (!filterContext.HttpContext.Request.IsAjaxRequest())
                filterContext.Result = RedirectToErrorPage(errorMessage);

            else filterContext.Result = new JsonResult()
            {
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = new
                {
                    Exception = errorMessage
                }
            };

            filterContext.ExceptionHandled = true;

            base.OnException(filterContext);
        }

        public ActionResult RedirectToErrorPage(string message)
        {
            SessionAccessor.Error = message;

            return Redirect(Url.Action("Index", "Error"));
        }
    }
}