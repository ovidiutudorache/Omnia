using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Omnia.WebTest.Models
{
    public class HomePage
    {
        public string FacebookUrl { get; set; }
        public string InstagramUrl { get; set; }

        public DM.AuthenticatedUser User { get; set; }
    }
}