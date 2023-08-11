# from django.db.models import Q

# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response

# from .serializers import *
# from .models import *


# @api_view(['GET'])
# def GetUsers(request):
#     users = User.objects.all()
#     serializer = UserSerializer(users, many=True)

#     return Response(serializer.data)
