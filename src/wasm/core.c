#define CONTEXT 0

#if CONTEXT
// Context:
// - 0: Host
// - 1: Dual

extern void addOrUpdate(int context, unsigned char indicies, unsigned short pid, unsigned short id, short x, short y, unsigned short size, unsigned char flags, int orderId);
extern void destroy(int context, unsigned short id);
extern void eat(int context, unsigned short pid, unsigned short eid);
#else
extern int addOrUpdate(unsigned char indicies, unsigned short pid, unsigned short id, short x, short y, unsigned short size, unsigned char flags, int orderId);
extern void destroy(unsigned short id);
extern void eat(unsigned short pid, unsigned short eid);
#endif

#define readUint8() (packet[offset]); offset += 1
#define readUint16be() (unsigned short)((packet[offset] << 8) | packet[offset + 1]); offset += 2
#define readInt16be() (short)((packet[offset] << 8) | packet[offset + 1]); offset += 2

#if CONTEXT
void deserialize(unsigned char* packet, int orderId, int context)
#else
int deserialize(unsigned char* packet, int orderId)
#endif
{
    int offset = 0;
    int result = 0;

    for (;;) {
        unsigned char indicies = readUint8();

        if (indicies == 0) break;

        unsigned char type = indicies & 0x0f;

        unsigned short pid = 0;
        unsigned short id = 0;
        short x = 0, y = 0;
        unsigned short size = 0;
        unsigned char flags = 0;

        if ((indicies & 0x1f) == 1) {
            pid = readUint16be();
        }
        
        id = readUint16be();
        
        if ((indicies & 0x20) == 0) {
            x = readInt16be();
            y = readInt16be();
        }

        if ((indicies & 0x40) == 0) {
            size = readUint16be();
        }
        
        if ((char)indicies < 0) {
            flags = readUint8(); 
        }
        
        result += addOrUpdate(
            #if CONTEXT
            context,
            #endif
            indicies,
            pid,
            id,
            x,
            y,
            size,
            (flags) | ((type == 4) | (flags > 0x0f)),
            orderId
        );
    }
    
    unsigned short count = readUint16be();

    while (count--) {
        unsigned short id = readUint16be();
        destroy( /* [cell] 'id' was deleted */
        #if CONTEXT
            context,
        #endif
            id
        ); 
    }

    count = readUint16be();

    while (count--) {
        unsigned short pid = readUint16be();
        unsigned short eid = readUint16be();
        eat( /* [prey] 'pid' was eaten by [eater] 'eid' */  
        #if CONTEXT
            context,
        #endif
            pid, 
            eid
        );
    }

    return result; /* # of player cells owned by client */
}