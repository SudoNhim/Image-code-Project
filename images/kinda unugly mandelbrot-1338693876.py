def getPixel( x,y ):
   mi = 255   x0 = x * 3.5 - 2.5   y0 = y * 2 - 1      mx = 0   my = 0      i = 0      while (i < mi):       if (mx**2 + my**2 >= 4):           break       (mx,my) = (mx*mx - my*my + x0, 2*mx*my + y0)       i = i + 1         l = (255 - (255/mi)*i)   r = (l) * (1 + sin(0.1*1 + 0.628)) / 2   b = (l) * (1 + sin(0.2*l + 0.785))/2   g = (l) * (1 + sin(0.3*l + 1.047)) / 2   
   return r%256,g%256,b%256