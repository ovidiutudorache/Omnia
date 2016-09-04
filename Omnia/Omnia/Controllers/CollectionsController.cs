using Omnia.Attributes;
using Omnia.BL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Omnia.Controllers
{
    public class CollectionsController : BaseApiController
    {
        [EndpointAuthorize]
        public List<DM.Collection> Get()
        {
            return ApplicationManager.MetadataManager.GetCollections();
        }

        [EndpointAuthorize]
        [Route("api/collections/{collection}")]
        public string Get(string collection)
        {
            return DateTime.Now.ToString();
        }
    }
}