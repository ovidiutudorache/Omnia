//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Omnia.DAL
{
    using System;
    using System.Collections.Generic;
    
    public partial class UserOAuthProviderLogins
    {
        public long Id { get; set; }
        public int ApplicationOAuthProviderId { get; set; }
        public System.DateTime LoginDate { get; set; }
        public string ExternalAccessToken { get; set; }
        public string AccessToken { get; set; }
        public int UserOAuthProviderId { get; set; }
    
        public virtual ApplicationOAuthProviders ApplicationOAuthProviders { get; set; }
        public virtual UserOAuthProviders UserOAuthProviders { get; set; }
    }
}