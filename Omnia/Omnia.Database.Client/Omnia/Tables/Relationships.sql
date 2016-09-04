CREATE TABLE [Omnia].[Relationships] (
    [Id]                 INT IDENTITY (1, 1) NOT NULL,
    [AttributeId]        INT NOT NULL,
    [RelatedAttributeId] INT NOT NULL,
    CONSTRAINT [PK_Relationships] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Relationships_Attributes] FOREIGN KEY ([AttributeId]) REFERENCES [Omnia].[Attributes] ([Id]),
    CONSTRAINT [FK_Relationships_RelatedAttributes] FOREIGN KEY ([RelatedAttributeId]) REFERENCES [Omnia].[Attributes] ([Id])
);

