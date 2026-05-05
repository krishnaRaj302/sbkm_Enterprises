from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

def home(request):
    return render(request, 'core/index.html')

@csrf_exempt
def ai_chat(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '').lower()
            
            response_text = "I am the SBKM AI Assistant. How can I help you with our luxury flooring solutions?"
            
            # Contact & Pricing
            if 'price' in user_message or 'cost' in user_message or 'quote' in user_message:
                response_text = "Our premium products are competitively priced based on your exact requirements. Would you like me to connect you with our experts on WhatsApp for an exact estimate?"
            elif 'contact' in user_message or 'phone' in user_message or 'whatsapp' in user_message:
                response_text = "You can reach us instantly via WhatsApp at +91 98465 54622 or by using the contact form at the bottom of the page."
            
            # The 8 Specialized Ecosystem Products
            elif 'artificial grass' in user_message or 'grass' in user_message:
                response_text = "Our ultra-premium Artificial Grass is durable, weather-resistant, and incredibly natural-looking. It's perfect for residential lawns, outdoor settings, and agricultural use."
            elif 'home gym' in user_message or 'gym mat' in user_message or 'gym' in user_message:
                response_text = "Our Home Gym Mats are custom-designed to ensure ultimate comfort and safety, providing maximum impact absorption for your workout spaces."
            elif 'farm' in user_message or 'turf' in user_message:
                response_text = "Our Farm & Turf Mats offer heavy-duty, rugged flooring perfectly suited for demanding agricultural and outdoor environments."
            elif 'vinyl' in user_message or 'vinyl car mat' in user_message:
                response_text = "We offer premium textured Vinyl Car Mats available in 0.75mm, 0.95mm, and 1mm thickness for superior vehicle protection and aesthetics."
            elif 'car mat' in user_message or 'car' in user_message:
                response_text = "We provide custom-fit protective Car Mats tailored specifically for luxury vehicles, ensuring your car's interior remains pristine. We also offer premium Vinyl Car Mats."
            elif 'yellow 9' in user_message or 'super bond yellow' in user_message:
                response_text = "Super Bond Yellow 9 is our industrial spray/brush rubber solution (4.5 LTR) specifically formulated for modern sofas, furniture, and mattresses."
            elif 'mytlok' in user_message or '743' in user_message or 'instant bonding' in user_message:
                response_text = "MyTLOK 743 is a high-performance single component instant bonding adhesive, highly recommended for toys, seat upholstery, and footwear applications."
            elif 'sr4x' in user_message or 'super bond sr4x' in user_message:
                response_text = "Super Bond SR4X is a premium synthetic rubber-based adhesive ideal for albums and floor mating. It is completely safe as it contains no harmful benzene."
            
            # General Industrial & Location
            elif 'industrial' in user_message or 'epoxy' in user_message or 'commercial' in user_message or 'adhesive' in user_message or 'bond' in user_message:
                response_text = "We provide state-of-the-art industrial bonding solutions including Super Bond Yellow 9, MyTLOK 743, and SR4X for furniture, upholstery, and commercial use."
            
            # Greeting commands
            elif 'hello' in user_message or 'hi' in user_message or 'hey' in user_message or 'start' in user_message or 'haii' in user_message or 'hii' in user_message:
                response_text = "Hello there! Welcome to SBKM Enterprises. Are you looking for artificial grass, gym mats, car mats, or our premium industrial adhesives today?"
            
            # Location and info commands
            elif 'where' in user_message or 'location' in user_message or 'kerala' in user_message or 'address' in user_message:
                response_text = "We are proud to be Kerala's elite choice for luxury flooring and industrial adhesives, located in Thenhipalam (KL130), with over 10 years of authority."
            
            # Command to show all products
            elif 'all product' in user_message or 'show product' in user_message or 'show all' in user_message or 'list' in user_message or 'products' in user_message or 'services' in user_message or 'ecosystem' in user_message:
                response_text = (
                    "Here are our premium products:<br><br>"
                    "• Artificial Grass<br>"
                    "• Home Gym Mats<br>"
                    "• Farm & Turf Mats<br>"
                    "• Protective Car Mats<br>"
                    "• Textured Vinyl Car Mats<br>"
                    "• Super Bond Yellow 9<br>"
                    "• MyTLOK 743<br>"
                    "• Super Bond SR4X<br><br>"
                    "Which of these would you like to explore further?"
                )
            
            # Fallback for unrecognized queries
            else:
                response_text = "That's an interesting question! Our specialized ecosystem covers gym mats, artificial grass, car mats, and premium adhesives. Could you provide a few more details so I can give you the perfect recommendation?"

            return JsonResponse({'reply': response_text})
        except Exception as e:
            return JsonResponse({'reply': "I'm having a little trouble connecting to my brain right now. Please try again!"}, status=500)
    
    return JsonResponse({'error': 'Invalid request'}, status=400)
