CREATE TABLE [dbo].[UserOAuthProviderLogins] (
    [Id]                         BIGINT         IDENTITY (1, 1) NOT NULL,
    [ApplicationOAuthProviderId] INT            NOT NULL,
    [UserOAuthProviderId]        INT            NOT NULL,
    [LoginDate]                  DATETIME       CONSTRAINT [DF_UserOAuthProviderLogins_LoginDate] DEFAULT (getdate()) NOT NULL,
    [ExternalAccessToken]        NVARCHAR (500) NOT NULL,
    [AccessToken]                NVARCHAR (500) NOT NULL,
    CONSTRAINT [PK_UserOAuthProviderLogins] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_UserOAuthProviderLogins_ApplicationOAuthProviders] FOREIGN KEY ([ApplicationOAuthProviderId]) REFERENCES [dbo].[ApplicationOAuthProviders] ([Id]),
    CONSTRAINT [FK_UserOAuthProviderLogins_UserOAuthProviders] FOREIGN KEY ([UserOAuthProviderId]) REFERENCES [dbo].[UserOAuthProviders] ([Id])
);

