CREATE TABLE [dbo].[ApplicationOAuthProviders] (
    [Id]              INT            IDENTITY (1, 1) NOT NULL,
    [ApplicationId]   INT            NOT NULL,
    [OAuthProviderId] INT            NOT NULL,
    [ExternalId]      NVARCHAR (250) NULL,
    [ExternalSecret]  NVARCHAR (250) NULL,
    [Scope]           NVARCHAR (250) NULL,
    CONSTRAINT [PK_ApplicationOAuthProviders] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_ApplicationOAuthProviders_Applications] FOREIGN KEY ([ApplicationId]) REFERENCES [dbo].[Applications] ([Id]),
    CONSTRAINT [FK_ApplicationOAuthProviders_OAuthProviders] FOREIGN KEY ([OAuthProviderId]) REFERENCES [dbo].[OAuthProviders] ([Id])
);

