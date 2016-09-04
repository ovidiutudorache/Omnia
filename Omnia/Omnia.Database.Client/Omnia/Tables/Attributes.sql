CREATE TABLE [Omnia].[Attributes] (
    [Id]           INT            IDENTITY (1, 1) NOT NULL,
    [Name]         NVARCHAR (250) NOT NULL,
    [CollectionId] INT            NOT NULL,
    [IsNullable]   BIT            CONSTRAINT [DF_Attributes_IsNullable] DEFAULT ((1)) NOT NULL,
    [IsPrimaryKey] BIT            CONSTRAINT [DF_Attributes_IsPrimaryKey] DEFAULT ((0)) NOT NULL,
    [Length]       INT            NULL,
    [Precision]    INT            NULL,
    [Scale]        INT            NULL,
    [Type]         INT            NOT NULL,
    [DefaultValue] NVARCHAR (MAX) NULL,
    [Formula]      NVARCHAR (MAX) NULL,
    [IsPersistent] BIT            CONSTRAINT [DF_Attributes_IsPersistent] DEFAULT ((0)) NOT NULL,
    [Description]  NVARCHAR (MAX) NULL,
    [Increment]    NUMERIC (38)   NULL,
    [Seed]         NUMERIC (38)   NULL,
    [IsSparse]     BIT            CONSTRAINT [DF_Attributes_IsSparse] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_Attributes] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Attributes_Collections] FOREIGN KEY ([CollectionId]) REFERENCES [Omnia].[Collections] ([Id])
);

