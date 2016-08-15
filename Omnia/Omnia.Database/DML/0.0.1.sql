SET IDENTITY_INSERT [dbo].[Applications] ON 

GO
INSERT [dbo].[Applications] ([Id], [PublicId], [Name], [PrivateKey], [RedirectUrl]) VALUES (1, N'81572b5d-78b5-46a3-a4d5-ff746e0910cb', N'Ovidiu', N'49619ECDD91D40F4B6BB5F57163EFE9D106DF09CC69547EBAA2C3405ACCF49B3', N'http://localhost/omnia.webtest/home/Authenticated')
GO
SET IDENTITY_INSERT [dbo].[Applications] OFF
GO
INSERT [dbo].[OAuthProviders] ([Id], [Name]) VALUES (1, N'Facebook')
GO
INSERT [dbo].[OAuthProviders] ([Id], [Name]) VALUES (2, N'Instagram')
GO
SET IDENTITY_INSERT [dbo].[ApplicationOAuthProviders] ON 

GO
INSERT [dbo].[ApplicationOAuthProviders] ([Id], [ApplicationId], [OAuthProviderId], [ExternalId], [ExternalSecret], [Scope]) VALUES (1, 1, 1, N'166348756801806', N'13dd94a93f8314c9b70176de3515bd34', N'email')
GO
INSERT [dbo].[ApplicationOAuthProviders] ([Id], [ApplicationId], [OAuthProviderId], [ExternalId], [ExternalSecret], [Scope]) VALUES (2, 1, 2, N'8705ff9afe75448787dc82c4c0b1f7c3', N'b8e118be883e4296a666ecc800269de4', N'basic')
GO
SET IDENTITY_INSERT [dbo].[ApplicationOAuthProviders] OFF
GO