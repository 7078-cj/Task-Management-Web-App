# Generated by Django 5.0.3 on 2025-02-16 15:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_notification_created_notification_update_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='project',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='project', to='api.project'),
            preserve_default=False,
        ),
    ]
