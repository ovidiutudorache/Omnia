CREATE function Omnia.[GetPrimaryKeys](
	@tableName nvarchar(max) = null
)
RETURNS TABLE
as
	return 
		(
			SELECT
				ccu.COLUMN_NAME as ColumnName
				, ccu.TABLE_SCHEMA as TableSchema
				, ccu.TABLE_NAME as TableName
				, ccu.CONSTRAINT_SCHEMA ConstraintSchema
				, ccu.CONSTRAINT_NAME as ConstraintName
			FROM
				INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
				, INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE ccu
			WHERE
				ccu.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
				and ccu.CONSTRAINT_SCHEMA = tc.CONSTRAINT_SCHEMA
				and tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
				and (@tableName is null or ccu.TABLE_SCHEMA + '.' + ccu.TABLE_NAME = @tableName)
		)