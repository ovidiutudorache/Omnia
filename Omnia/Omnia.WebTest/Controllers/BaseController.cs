using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Omnia.WebTest.Controllers
{
    public class BaseController : Controller
    {
        private static Omnia.Client.Consumer omnia = null;
        public static Omnia.Client.Consumer Omnia { get { return omnia ?? (omnia = new Client.Consumer(Settings.App.ApplicationId)); } }

        public class Settings
        {
            public class App
            {
                public static readonly string ApplicationId = ConfigurationManager.AppSettings["APP:ApplicationId"];
            }
        }
    }
}