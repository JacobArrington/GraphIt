"""added width and height instead of just size

Revision ID: 879fc4da5683
Revises: f21aecdc5df8
Create Date: 2023-05-27 17:57:55.683802

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '879fc4da5683'
down_revision = 'f21aecdc5df8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('visualizations', schema=None) as batch_op:
        batch_op.add_column(sa.Column('width', sa.Integer(), nullable=False))
        batch_op.add_column(sa.Column('height', sa.Integer(), nullable=False))
        batch_op.drop_column('size')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('visualizations', schema=None) as batch_op:
        batch_op.add_column(sa.Column('size', sa.VARCHAR(length=64), nullable=True))
        batch_op.drop_column('height')
        batch_op.drop_column('width')

    # ### end Alembic commands ###
